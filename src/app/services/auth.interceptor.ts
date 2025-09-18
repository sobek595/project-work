import { inject } from "@angular/core";
import { JwtService } from "../services/jwt.service";
import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `JwtService` and use it to get an authentication token:
  const authToken = inject(JwtService).getToken();
  // Clone the request to add the authentication header.
  if (authToken) {
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${authToken}`),
    });
    return next(newReq);
  } else {
    return next(req);
  }
}