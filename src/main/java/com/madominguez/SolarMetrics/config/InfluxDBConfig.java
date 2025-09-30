package com.madominguez.SolarMetrics.config;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InfluxDBConfig {

    private static String IP = "192.168.5.48";

    @Bean
    public InfluxDBClient influxDBClient() {
        String token = "RKYNJiD-Bftm5Ct4-SHWDD4awjyX2wTjbOtKrwzhqnFcHVL5y9Pcs4kyuhbDTewUrVkT-Kop58YOY49M9jk5ag==";
        String url = "http://"+IP+":8086";
        String org = "mdomgar";
        String bucket = "SolarData";

        return InfluxDBClientFactory.create(url,token.toCharArray(), org, bucket);
    }

}
