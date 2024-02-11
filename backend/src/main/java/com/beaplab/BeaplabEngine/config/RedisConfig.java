/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.config;

import com.beaplab.BeaplabEngine.util.redis.RedisMessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.GenericToStringSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.session.ExpiringSession;
import org.springframework.session.data.redis.RedisOperationsSessionRepository;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.web.context.AbstractHttpSessionApplicationInitializer;

/**
 * Created by arastoo on 25/05/17.
 * Email Address: a.bozorgi67@gmail.com
 */

/**
 * this class defines different configurations needed for Redis. the class has @EnableRedisHttpSession to enable http session backed with Redis
 */

@Configuration
@EnableRedisHttpSession
@ComponentScan("com.beaplab.BeaplabEngine")
@PropertySource("classpath:redis.properties")
public class RedisConfig extends AbstractHttpSessionApplicationInitializer {


    @Autowired
    Environment environment;


    /**
     * defining Redis connectionFactory
     * @return JedisConnectionFactory
     */
    @Bean
    JedisConnectionFactory jedisConnectionFactory() {
        JedisConnectionFactory jedisConFactory = new JedisConnectionFactory();
        /**
         * defining Redis server configuration, otherwise a single Redis server runs on localhost with default configurations
         */
        jedisConFactory.setDatabase(Integer.parseInt(environment.getProperty("redis.database")));
        jedisConFactory.setHostName(environment.getProperty("redis.host"));
        jedisConFactory.setPort(Integer.parseInt(environment.getProperty("redis.port")));
        jedisConFactory.setTimeout(Integer.parseInt(environment.getProperty("redis.timeout")));

        return jedisConFactory;
    }



    /**
     * defining RedisTemplate which can be used for querying data with a custom repository
     * @return RedisTemplate< String, Object >
     */
    @Bean
    RedisTemplate< String, Object > redisTemplate() {
        final RedisTemplate< String, Object > template =  new RedisTemplate< String, Object >();
        template.setConnectionFactory( jedisConnectionFactory() );

        template.setKeySerializer( new StringRedisSerializer() );
        template.setHashValueSerializer( new GenericToStringSerializer< Object >( Object.class ) );
        template.setValueSerializer( new GenericToStringSerializer< Object >( Object.class ) );

        return template;
    }

    @Bean
    public RedisTemplate<String,ExpiringSession> sessionRedisTemplate() {
        RedisTemplate<String, ExpiringSession> template = new RedisTemplate<String, ExpiringSession>();
        template.setConnectionFactory( jedisConnectionFactory() );

        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericToStringSerializer<ExpiringSession>(ExpiringSession.class));

        return template;
    }



    /**
     * defining Redis MessageListener
     * @return MessageListenerAdapter
     */
    @Bean
    MessageListenerAdapter messageListener() {
        return new MessageListenerAdapter( new RedisMessageListener() );
    }


    /**
     * configuring Redis RedisMessageListenerContainer
     * @return RedisMessageListenerContainer
     */
    @Bean
    RedisMessageListenerContainer redisContainer() {
        final RedisMessageListenerContainer container = new RedisMessageListenerContainer();

        container.setConnectionFactory( jedisConnectionFactory() );
        container.addMessageListener( messageListener(), new ChannelTopic( "my-queue" ) );

        return container;
    }



    /**
     * override sessionRepository construction to set the custom session-timeout
     */
    @Bean
    public RedisOperationsSessionRepository sessionRepository() {
        RedisOperationsSessionRepository sessionRepository = new RedisOperationsSessionRepository(jedisConnectionFactory());
        sessionRepository.setDefaultMaxInactiveInterval(Integer.parseInt(environment.getProperty("redis.timeout")));
        return sessionRepository;
    }

}
