import { ApiProperty } from "@nestjs/swagger";
import { ApplicationDto } from "./app.dto";

/**
 * Response object for retrieving the list of applications.
 */
export class GetAppsResponseDto {
    @ApiProperty({
        description: 'The list of applications',
        type: [ApplicationDto]
    })
    applications: ApplicationDto[];
}
