import { ApiProperty } from "@nestjs/swagger";

export class GetAppPrefsRequestDto {
    @ApiProperty({ description: 'The name of the application' })
    app: string;

    @ApiProperty({ description: 'If specified will return the preferences only if they were updated after this date.', type: Date })
    lastKnownUpdate?: Date;
}