import { ApiProperty } from "@nestjs/swagger";

export class GetConfigsRequestDto {
    @ApiProperty({
        description: 'Comma separated list of JSON configuration files to retrieve. Use "*" to retrieve all configurations.',
    })
    configs: string;
}

