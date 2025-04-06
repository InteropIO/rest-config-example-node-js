import { ApiProperty } from "@nestjs/swagger";
import { LayoutDto } from "./layout.dto";

export class GetLayoutsResponseDto {
    @ApiProperty({ description: 'The list of layouts', type: [LayoutDto] })
    layouts: LayoutDto[];
}