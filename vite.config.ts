import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { spawn, type ChildProcess } from 'child_process';

function phpBackendPlugin(): Plugin {
  let phpProcess: ChildProcess | null = null;

  return {
    name: 'vite-plugin-php-backend',
    configureServer(server) {
      // Check if PHP server is already running on port 8000
      const req = http.get('http://127.0.0.1:8000/api/health', (res) => {
        res.resume();
      });

      req.on('error', () => {
        console.log('\n[vite] 🚀 Auto-starting PHP REST API backend on http://127.0.0.1:8000...');
        phpProcess = spawn('php', ['-d', 'extension=pdo_sqlite', '-S', '127.0.0.1:8000', 'api/index.php'], {
          cwd: process.cwd(),
          stdio: 'inherit',
          shell: true
        });

        phpProcess.on('error', (err) => {
          console.error('[vite] Could not auto-start PHP backend:', err.message);
        });
      });

      req.setTimeout(800, () => {
        req.destroy();
      });

      const cleanup = () => {
        if (phpProcess && !phpProcess.killed) {
          phpProcess.kill();
          phpProcess = null;
        }
      };

      server.httpServer?.on('close', cleanup);
      process.on('exit', cleanup);
      process.on('SIGINT', () => {
        cleanup();
        process.exit();
      });
      process.on('SIGTERM', () => {
        cleanup();
        process.exit();
      });
    },
    closeBundle() {
      const srcApi = path.resolve(process.cwd(), 'api');
      const distApi = path.resolve(process.cwd(), 'dist/api');
      if (fs.existsSync(srcApi)) {
        fs.cpSync(srcApi, distApi, { recursive: true });
        console.log('\n[vite] ✅ PHP REST API bundled into dist/api/ for Hostinger deployment.');
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), phpBackendPlugin()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'vendor-three';
            }
            if (id.includes('gsap') || id.includes('lenis')) {
              return 'vendor-anim';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react-helmet-async')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      clientPort: 5173
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            if ('writeHead' in res && typeof res.writeHead === 'function' && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, message: 'PHP Backend starting up, please refresh.' }));
            }
          });
        }
      }
    }
  }
});
