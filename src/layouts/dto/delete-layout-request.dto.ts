import { ApiProperty } from "@nestjs/swagger";

export class DeleteLayoutRequestDto {
    @ApiProperty({ description: 'The name of the layout'})
    name: string;

    @ApiProperty({ description: 'The type of the layout'})
    type: string;
}