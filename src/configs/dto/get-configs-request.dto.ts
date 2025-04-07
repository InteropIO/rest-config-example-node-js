import { ApiProperty } from "@nestjs/swagger";

export class GetConfigsRequestDto {
    @ApiProperty({
        description: 'Overriding JSON configuration for the `system.json` file of io.Connect Desktop.',
    })
    identifier: string;

    @ApiProperty({
        description: 'Overriding JSON configuration for the `channels.json` file of io.Connect Desktop',
    })
    configs: string;

    @ApiProperty({
        description: 'Overriding JSON configuration for the `logger.json` file of io.Connect Desktop',
    })
    exact: boolean;
}