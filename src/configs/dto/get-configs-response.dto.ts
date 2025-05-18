import { ApiProperty } from "@nestjs/swagger";

export class GetConfigsResponseDto {
    @ApiProperty({
        description: 'Overriding JSON configuration for the `system.json` file of io.Connect Desktop.',
    })
    "system.json": string;

    @ApiProperty({
        description: 'Overriding JSON configuration for the `channels.json` file of io.Connect Desktop',
    })
    "channels.json": string;

    @ApiProperty({
        description: 'Overriding JSON configuration for the `logger.json` file of io.Connect Desktop',
    })
    "logger.json": string;
}
