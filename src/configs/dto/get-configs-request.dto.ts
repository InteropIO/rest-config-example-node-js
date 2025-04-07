import { ApiProperty } from "@nestjs/swagger";

export class GetConfigsRequestDto {
    @ApiProperty({
        description: 'Comma seperated list of JSON configurations files to retrieve. If',
    })
    configs: string;   
}