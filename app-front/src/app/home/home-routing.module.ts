import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { PostComponent } from './post/post.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MyProductsComponent } from './myproducts/myproducts.component';
import { ProfileComponent } from './profile/profile.component';
import { CommentComponent } from './comment/comment.component';
import { TaskComponent } from './task/task.component';
import { OptionListComponent } from './option-list/option-list.component';
import { PartnersComponent } from './partners/partners.component';
import { ProductComponent } from './product/product.component';
import { PostFakeNewsComponent } from './postFakeNews/post-fake-news.component';
const routes: Routes = [
	{ path: '', 
    redirectTo: 'welcome', 
    pathMatch: 'full' 
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      { component: PostComponent, path: 'post' },
      { component: OptionListComponent, path: 'option-list' },
      { component: CommentComponent, path: 'post/:id' },
      { component: AboutComponent, path: 'about' },
      { component: TaskComponent, path: 'task' },
      { component: ContactUsComponent, path: 'contact-us' },
      { component: MyProductsComponent, path: 'myproducts' },
      { component: ProfileComponent, path: 'profile/:username' },
      { component: ProfileComponent, path: 'myprofile/:username' },
      { component: PartnersComponent, path: 'contact' },
      { component: ProductComponent, path: 'product/:id' },
      { component: PostFakeNewsComponent, path: 'postFakeNews' },
    ]
  },
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeRoutingModule { }
