import { ApiProperty } from "@nestjs/swagger";

export class AddPrefsRequestDto {
    @ApiProperty({ description: 'The application name'})
    app: string;

    @ApiProperty({ description: 'The actual data to be stored', type: Object})
    data?: Record<string, any>;
}