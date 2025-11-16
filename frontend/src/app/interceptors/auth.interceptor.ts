import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  console.log('🔍 Interceptor - URL:', req.url);
  console.log(
    '🔍 Interceptor - Token trouvé:',
    token ? 'OUI (' + token.substring(0, 20) + '...)' : 'NON'
  );

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(
      '✅ Interceptor - Header ajouté:',
      cloned.headers.get('Authorization')?.substring(0, 30) + '...'
    );
    return next(cloned);
  }

  console.log('⚠️ Interceptor - Requête sans token');
  return next(req);
};
