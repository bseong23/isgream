package com.ssafy.iscream.common.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(servers = {
        @Server(url = "http://localhost:8080/api", description = "local server"),
        @Server(url = "https://i12a407.p.ssafy.io/api", description = "deploy server")
})
public class SwaggerConfig {

    @Bean
    OpenAPI openAPI() {
        Info info = new Info().title("API 명세서").description(
                        "<h3>API Reference for Developers</h3>API 명세서")
                .version("v1").contact(new io.swagger.v3.oas.models.info.Contact().name("minchae")
                        .email("minchae075@naver.com").url("http://edu.ssafy.com"));

        return new OpenAPI()
                .info(info)
                .components(securityComponents())
                .addSecurityItem(new SecurityRequirement().addList("access"))
                .paths(customPaths());
    }

    @Bean
    GroupedOpenApi allApi() {
        return GroupedOpenApi.builder()
                .group("all") // 그룹 이름 지정
                .pathsToMatch( "/users/**", "/htp-tests/**", "/board/**", "/comments/**",
                        "/calendars/**", "/children/**", "/educations/**", "/pat-tests/**",
                        "/big-five-tests/**", "/chatbot/**")
                .build();
    }

    @Bean
    GroupedOpenApi chatbotApi() {
        return GroupedOpenApi.builder().group("chatbot").pathsToMatch("/chatbot/**").build();
    }

    @Bean
    GroupedOpenApi commentApi() {
        return GroupedOpenApi.builder().group("comment").pathsToMatch("/comments/**").build();
    }

    @Bean
    GroupedOpenApi boardApi() {
        return GroupedOpenApi.builder().group("board").pathsToMatch("/board/**").build();
    }

    @Bean
    GroupedOpenApi userApi() {
        return GroupedOpenApi.builder().group("users").pathsToMatch("/users/**").build();
    }

    @Bean
    GroupedOpenApi authApi() {
        return GroupedOpenApi.builder().group("auth").pathsToMatch("/users/join", "/users/reissue", "/users/login", "/users/logout").build();
    }

    @Bean
    GroupedOpenApi calendarApi() {
        return GroupedOpenApi.builder()
                .group("calendar")
                .pathsToMatch("/calendars/**")
                .build();
    }
    @Bean
    GroupedOpenApi childrenApi() {
        return GroupedOpenApi.builder()
                .group("children")
                .pathsToMatch("/children/**")
                .build();
    }

    @Bean
    GroupedOpenApi patApi() {
        return GroupedOpenApi.builder()
                .group("pat")
                .pathsToMatch("/pat-tests/**")
                .build();
    }

    @Bean
    GroupedOpenApi bigFiveApi() {
        return GroupedOpenApi.builder()
                .group("big-five")
                .pathsToMatch("/big-five-tests/**")
                .build();
    }

    @Bean
    GroupedOpenApi htpTestApi() {
        return GroupedOpenApi.builder()
                .group("htp")
                .pathsToMatch("/htp-tests/**")
                .build();
    }

    @Bean
    GroupedOpenApi educationApi() {
        return GroupedOpenApi.builder()
                .group("education")
                .pathsToMatch("/educations/**")
                .build();
    }

    private Components securityComponents() {
        return new Components()
                .addSecuritySchemes("access", new SecurityScheme()
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.HEADER)
                        .name("access"));
    }

    // 로그인, 로그아웃
    private Paths customPaths() {
        Paths paths = new Paths();

        paths.addPathItem("/users/login", new PathItem()
                .post(new io.swagger.v3.oas.models.Operation()
                        .summary("로그인")
                        .addTagsItem("auth")
                        .requestBody(new RequestBody()
                                .content(new Content().addMediaType("application/json", new MediaType()
                                        .schema(new Schema<>().type("object")
                                                .addProperty("email", new Schema<String>().type("string").example("test@naver.com"))
                                                .addProperty("password", new Schema<String>().type("string").example("1234"))
                                        )))
                                .required(true)
                        )
                        .responses(new ApiResponses()
                                .addApiResponse("200", new ApiResponse().description("로그인 성공").content(new Content().addMediaType("application/json", new MediaType().schema(new Schema<String>().type("string")))))
                                .addApiResponse("401", new ApiResponse().description("인증 실패"))
                        )
                ));

        paths.addPathItem("/users/logout", new PathItem()
                .post(new io.swagger.v3.oas.models.Operation()
                        .summary("로그아웃")
                        .addTagsItem("auth")
                        .responses(new ApiResponses()
                                .addApiResponse("200", new ApiResponse().description("로그아웃 성공").content(new Content().addMediaType("application/json", new MediaType().schema(new Schema<String>().type("string")))))
                                .addApiResponse("401", new ApiResponse().description("인증 실패"))
                        )
                ));

        return paths;
    }
}
