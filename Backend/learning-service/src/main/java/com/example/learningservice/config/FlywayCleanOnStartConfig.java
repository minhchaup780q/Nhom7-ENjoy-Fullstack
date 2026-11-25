package com.example.learningservice.config;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.BeanDefinitionStoreException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(prefix = "app.flyway", name = "clean-on-start", havingValue = "true")
public class FlywayCleanOnStartConfig {

    @Bean(name = "flywayCleanBeforeHibernate", initMethod = "clean")
    Flyway flywayCleanBeforeHibernate(DataSource dataSource) {
        return Flyway.configure()
                .dataSource(dataSource)
                .cleanDisabled(false)
                .load();
    }

    @Bean
    static BeanFactoryPostProcessor makeHibernateDependOnFlywayClean() {
        return beanFactory -> {
            String entityManagerFactoryBean = "entityManagerFactory";
            if (!beanFactory.containsBeanDefinition(entityManagerFactoryBean)) {
                throw new BeanDefinitionStoreException(
                        "Could not find entityManagerFactory to run Flyway clean before Hibernate");
            }

            BeanDefinition entityManagerFactory =
                    beanFactory.getBeanDefinition(entityManagerFactoryBean);
            Set<String> dependencies = new LinkedHashSet<>();
            String[] existingDependencies = entityManagerFactory.getDependsOn();
            if (existingDependencies != null) {
                dependencies.addAll(Arrays.asList(existingDependencies));
            }
            dependencies.add("flywayCleanBeforeHibernate");
            entityManagerFactory.setDependsOn(dependencies.toArray(new String[0]));
        };
    }
}
