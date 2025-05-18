import { ApiProperty } from "@nestjs/swagger";
import { LayoutDto } from "./layout.dto";

export class SaveLayoutRequestDto {
    @ApiProperty({ description: 'The layout to be saved'})
    layout: LayoutDto;    
}
