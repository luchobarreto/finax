package com.finax.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    @NotBlank(message = "Name is mandatory")
    @Size(message = "Full name must be between 5 and 50 characters long", min = 5, max = 50)
    private String fullName;
}
