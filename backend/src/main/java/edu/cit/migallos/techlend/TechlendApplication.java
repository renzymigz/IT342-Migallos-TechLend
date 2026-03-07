package edu.cit.migallos.techlend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TechlendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechlendApplication.class, args);
	}

}
