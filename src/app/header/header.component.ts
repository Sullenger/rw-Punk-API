// ============================================
// ; Title: RW Punk API Technical Challenge
// ; Author: Jason Sullenger
// ; Date: 11/01/2020
// ; Description: General Website. Calls Punk API.
// ; Users can filter and search.
// ;===========================================

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateHome() {
    this.router.navigate([""]);
  }

  navigateBeerList() {
    this.router.navigate(["./beerList"]);
  }

  navigateContact(){
    this.router.navigate(["./contact-us"]);
  }

  navigateAbout(){
    this.router.navigate(["./about-us"]);
  }
}
