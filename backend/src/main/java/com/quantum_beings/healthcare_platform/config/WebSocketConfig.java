package com.quantum_beings.healthcare_platform.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final AppOriginProperties appOriginProperties;

    @Autowired
    public WebSocketConfig(AppOriginProperties appOriginProperties) {
        this.appOriginProperties = appOriginProperties;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // The endpoint the React frontend will use to connect
        registry.addEndpoint("/ws-telemedicine")
                .setAllowedOriginPatterns(appOriginProperties.getAllowedOriginPatterns().toArray(String[]::new))
                .withSockJS(); // Fallback option for older browsers
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefixes for outgoing messages from the server to the client
        registry.enableSimpleBroker("/topic", "/queue");
        // Prefix for incoming messages from the client to the server
        registry.setApplicationDestinationPrefixes("/app");
    }
}
