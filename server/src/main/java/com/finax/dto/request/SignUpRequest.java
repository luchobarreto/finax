package com.finax.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {
    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Username is mandatory")
    @Size(message = "Username must be at least 5 characters long", min = 5)
    private String username;
    
    @NotBlank(message = "Password is mandatory")
    @Size(message = "Password must be at least 6 characters long", min = 6, max = 30)
    private String password;
    
    @NotBlank(message = "Name is mandatory")
    @Size(message = "Full name must be between 5 and 50 characters long", min = 5, max = 50)
    private String fullName;
}
