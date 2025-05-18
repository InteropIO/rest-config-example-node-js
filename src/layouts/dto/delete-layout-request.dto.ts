import { ApiProperty } from "@nestjs/swagger";

export class DeleteLayoutRequestDto {
    @ApiProperty({ description: 'The name of the layout'})
    name?: string;

    @ApiProperty({ description: 'The type of the layout'})
    type?: string;

    @ApiProperty({ description: 'The ids of the layouts to be removed. Use this if you want to remove multiple layouts at once.'})
    ids?: string[];
}
