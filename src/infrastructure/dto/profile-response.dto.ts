export class ProfileResponseDto {
    id_profile: string
    id_user: string;
    first_name: string; 
    last_name: string; 
    document_type: string; 
    document_number: string; 
    phone: string; 
    address: string; 

  constructor(user: any) {
    this.id_profile = user.id_profile;
    this.id_user = user.id_user;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.document_type = user.document_type;
    this.document_number = user.document_number;
    this.phone = user.phone;
    this.address = user.address;
  }
}