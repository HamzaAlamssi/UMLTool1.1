package com.uml.tool.handlers;

import com.uml.tool.constants.UserRoles;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import java.io.IOException;

@Slf4j
public class AuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws ServletException, IOException {
        boolean isDesigner = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> UserRoles.USER
                        .equals(UserRoles.getEnumByValue(grantedAuthority.getAuthority())));
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> UserRoles.ADMIN
                        .equals(UserRoles.getEnumByValue(grantedAuthority.getAuthority())));
        if (isAdmin) {
            setDefaultTargetUrl("/admins/dashboard");
        } else if (isDesigner) {
            log.error("designers/dashboard");
            setDefaultTargetUrl("/designers/dashboard");
        }

        else
            setDefaultTargetUrl("/homepage");
        super.onAuthenticationSuccess(request, response, authentication);
    }
}
