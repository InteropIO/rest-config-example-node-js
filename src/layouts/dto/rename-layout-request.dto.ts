import { ApiProperty } from "@nestjs/swagger";
import { LayoutDto } from "./layout.dto";


export class RenameLayoutRequestDto{
    @ApiProperty({ description: 'The layout to be renamed'})
    layout: LayoutDto;

    @ApiProperty({ description: 'The new name for the layout'})
    newName: string;
}