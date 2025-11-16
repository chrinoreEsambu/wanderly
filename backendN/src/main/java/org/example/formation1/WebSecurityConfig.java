package org.example.formation1;

import org.example.formation1.security.jwt.AuthEntryPointJwt;
import org.example.formation1.security.jwt.AuthTokenFilter;
import org.example.formation1.security.services.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {

	private static final Logger logger = LoggerFactory.getLogger(WebSecurityConfig.class);

	@Autowired
	UserDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.cors().and().csrf().disable()
				.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and()
			// 🔓 IMAGES PUBLIQUES - Ignorer complètement la sécurité Spring pour les fichiers
			.authorizeHttpRequests(authorize -> authorize
					.requestMatchers("/voyage/files/**").permitAll()  // 🔓 Images voyages TOTALEMENT PUBLIQUES
					.requestMatchers("/user/files/**").permitAll()    // 🔓 Images users TOTALEMENT PUBLIQUES
					.requestMatchers("/voyage/**").permitAll()        
					.requestMatchers("/user/**").permitAll()
					.requestMatchers("/category/**").permitAll()
					.requestMatchers("/reservation/**").permitAll()
					.anyRequest().authenticated()                    
			)
			// ⚠️ NE PAS appliquer authenticationEntryPoint sur /files/ - c'est lui qui cause le 401
			.exceptionHandling(exceptions -> exceptions
				.authenticationEntryPoint((request, response, authException) -> {
					String path = request.getRequestURI();
					// Si c'est un fichier, ne RIEN faire (pas de 401)
					if (path.contains("/files/")) {
						logger.info("✅ Fichier public accessible sans erreur: {}", path);
						return;
					}
					// Sinon, appliquer le handler normal
					unauthorizedHandler.commence(request, response, authException);
				})
			);
		
		http.authenticationProvider(authenticationProvider());
		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
