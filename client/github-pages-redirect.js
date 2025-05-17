// Single Page Apps for GitHub Pages
// MIT License
// This script handles GitHub Pages routing by redirecting properly
// Adapted for the test2 repository

(function() {
  // Check if we need to redirect
  if (window.location.pathname.indexOf('/test2/') === 0) {
    // This is a GitHub Pages deployment - handle routing by
    // redirecting all requests to index.html except for files and assets
    var path = window.location.pathname.substr('/test2/'.length);
    
    // Skip redirection for actual files/assets
    if (path.indexOf('.') === -1 && 
        path.indexOf('assets/') !== 0 && 
        path !== '') {
      // This is a route - ensure we use the correct redirects
      window.history.replaceState(null, null, '/test2/' + path);
    }
  }
  
  // Record the base path for the application to use
  window.appBasePath = '/test2';
})();