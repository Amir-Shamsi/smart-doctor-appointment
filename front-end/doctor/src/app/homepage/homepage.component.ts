import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { GetService } from 'src/services/get.service';
import { PostService } from 'src/services/post.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private post: PostService,private router: Router) {}

  ngOnInit(): void {
      AOS.init();
  }

  onBook(){
    if(this.post.loggedIn())
      this.router.navigate(['/dashboard']);
    else
      this.router.navigate(['/register']);

  }

}
