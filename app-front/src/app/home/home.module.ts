import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { PostComponent } from './post/post.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MyProductsComponent } from './myproducts/myproducts.component';
import { ProfileComponent } from './profile/profile.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommentComponent } from './comment/comment.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TaskComponent } from './task/task.component';
import { OptionListComponent } from './option-list/option-list.component';
import { PartnersComponent } from './partners/partners.component';
import { ProductComponent } from './product/product.component';
import { PostFakeNewsComponent } from './postFakeNews/post-fake-news.component';

@NgModule({
  declarations: [HomeComponent, PostComponent, AboutComponent, ContactUsComponent, MyProductsComponent, 
    ProfileComponent, CommentComponent, TaskComponent, OptionListComponent,
     PartnersComponent, ProductComponent, PostFakeNewsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    HttpClientModule,
    NgbModule,
    NgSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class HomeModule { }
