import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LayoutDto } from "./layout.dto";

export class SaveLayoutRequest {
    @ApiProperty({ description: 'The layout to be saved'})
    layout: LayoutDto;    
}