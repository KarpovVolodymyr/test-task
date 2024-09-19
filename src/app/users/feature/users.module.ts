import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbInputDatepicker, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { UserFormComponent } from '../ui';
import { UserFormHelperService } from '../utils/user-form-helper.service';
import { UsersService } from '../data-access/users.service';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ``,
        component: UsersComponent
      }
    ]),
    ReactiveFormsModule,
    NgbTypeahead,
    NgbInputDatepicker,
    UserFormComponent,
  ],
  providers: [UserFormHelperService, UsersService]
})
export class UsersModule {
}
