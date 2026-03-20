<script setup>
import PWAPrompt from './components/PWAPrompt.vue';
</script>

<template>
  <PWAPrompt />
  <router-view />
  <footer class="site-footer">
    <div class="footer-content">
      <p>&copy; 2026 La Gasolinera Más Barata.</p>
      <p class="author-credits">
        Desarrollada por 
        <a href="https://jcampos-dev.vercel.app" target="_blank" rel="noopener noreferrer" class="author-link">
          <strong>José Manuel Campos</strong>
        </a>
        <span class="badge">Desarrollador Junior</span>
      </p>
      <div class="social-links">
        <a href="https://github.com/JMCG84/lagasolinamasbarata" target="_blank" rel="noopener noreferrer" class="social-link" title="Ver código fuente en GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          Código Fuente
        </a>
      </div>
    </div>
  </footer>
</template>

<style>
.site-footer {
  text-align: center;
  padding: 2.5rem 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border-color);
  background: var(--surface-bg);
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.footer-content p {
  margin: 0;
}

.author-credits {
  font-size: 0.95rem;
  margin-top: 0.25rem;
}

.author-credits strong {
  color: var(--text-base);
  font-weight: 600;
}

.badge {
  display: inline-block;
  background: rgba(59, 130, 246, 0.15);
  color: var(--primary-light);
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  vertical-align: middle;
}

.author-link {
  color: var(--primary-light);
  text-decoration: none;
  transition: color 0.2s;
}

.author-link:hover {
  color: var(--text-base);
  text-decoration: underline;
}

.social-links {
  margin-top: 1rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.social-link:hover {
  color: var(--text-base);
  border-color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
}
</style>
