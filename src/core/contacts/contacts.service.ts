import { Injectable } from '@nestjs/common';
import { ContactsRepository } from '../../datalake/contacts/contacts.repository';
import { ContactsInterface } from '../../common/types/contacts.types';

@Injectable()
export class ContactsService {
  constructor(private readonly contactsRepo: ContactsRepository) {}

  public async update(dto: ContactsInterface) {
    return this.contactsRepo.create({ ...dto });
  }

  public async getActual(): Promise<ContactsInterface> {
    return this.contactsRepo.findOne({}, {}, { sort: { createdAt: -1 } });
  }
}
