package com.uml.tool.DTO;

import lombok.Data;

@Data
public class MessageDTO {
    private String senderId;
    private Long projectId;
    private String content;
}
