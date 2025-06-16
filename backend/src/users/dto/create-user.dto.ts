export class CreateUserDto {
    name: {
        first: string;
        middle?: string;
        last?: string;
    };
    wristBandNumber: string;
    seatNumber: string;
}
