/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util.redis;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;

/**
 * this is the message listener class of Redis
 */
public class RedisMessageListener implements MessageListener {

    @Override
    public void onMessage(Message message, byte[] bytes) {
        System.out.println( "Received by RedisMessageListener: " + message.toString() );
    }
}
