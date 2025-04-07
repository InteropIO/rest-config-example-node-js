import { ApiProperty } from "@nestjs/swagger";

export class RemoveAppPrefsRequestDto {
    @ApiProperty({ description: 'The name of the application' })
    app?: string;
}