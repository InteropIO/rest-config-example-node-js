import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AppPreferences {
    @ApiProperty({ description: 'The name of the layout'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The type of the layout'})
    @IsString()
    @IsNotEmpty()
    type: string;
}