import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    let {email} = createUserDto;
    let user = await this.userRepository.findOneBy({email});
    if (user) {
      throw new HttpException('Email already exist',HttpStatus.BAD_REQUEST);
    };
    let createdUser = this.userRepository.create(createUserDto);
    this.userRepository.save(createdUser);
    return 'User '+createUserDto.name+' created successfully';
  }

  findAll() {
    return this.userRepository.find({take:100});
  }

  async findOne(id: number) {
    let user = await this.userRepository.findOneBy({id});
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await this.userRepository.findOneBy({id});
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    this.userRepository.update({id}, {...updateUserDto});
    
    return 'Update success';
  }

  async remove(id: number) {
    let user = await this.userRepository.findOneBy({id});
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    this.userRepository.delete({id});

    return 'Delete success';
  }
}
