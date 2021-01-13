// ============================================
// ; Title: RW Punk API Technical Challenge
// ; Author: Jason Sullenger
// ; Date: 11/01/2020
// ; Description: General Website. Calls Punk API.
// ; Users can filter and search.
// ;===========================================

import { Component, OnInit } from "@angular/core";
import { APICallService } from "../../apicall.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { BeerDialogComponent } from "../beer-dialog/beer-dialog.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-beer-results",
  templateUrl: "./beer-results.component.html",
  styleUrls: ["./beer-results.component.css"],
})
export class BeerResultsComponent implements OnInit {
  beerList: any;
  pageNumber: any;
  panelOpenState = false;
  // public beerResult
  selectedFilter: any = {
    alcoholContent: "",
    name: "",
  };

  constructor(
    private api: APICallService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  public applyFilter(event, selection) {
    console.log(event);

    if (event.screenX == 0) {
      this.selectedFilter.name = "";
    } else {
      this.selectedFilter.alcoholContent = "";
    }

    if (selection.alcoholContent) {
      this.selectedFilter.name = "";
      if (selection.alcoholContent == "Greater") {
        this.api.filterGreaterThan().subscribe((data) => {
          // Response from API Call
          console.log("API Greater Call", data), (this.beerList = data);
        });
      } else if (selection.alcoholContent == "Lesser") {
        this.api.filterLessThan().subscribe((data) => {
          // Response from API Call
          console.log("API Lesser Call", data), (this.beerList = data);
        });
      }
      this.pageNumber = 1;
    } else if (!selection.alcoholContent && !selection.name) {
      this.api.callAPI().subscribe((data) => {
        // Response from API Call
        console.log("API Call", data), (this.beerList = data);
      });
      this.pageNumber = 1;
    } else if (selection.name) {
      this.selectedFilter.alcoholContent = "";
      this.api.searchByName(this.selectedFilter.name).subscribe((data) => {
        // Response from API Call
        console.log("API Search Call", data), (this.beerList = data);
      });
      this.pageNumber = 1;
    }
  }

  clearedSearch() {
    this.selectedFilter.name = "";
    this.api.callAPI().subscribe((data) => {
      // Response from API Call
      // console.log('API Call', data),
      this.beerList = data;
    });
  }

  openDialog(beer) {
    const dialogConfig = new MatDialogConfig();

    const beerDialog = this.dialog.open(BeerDialogComponent, {
      width: "40%",
      height: "90%",
      data: beer,
    });

    //beerDialog.componentInstance.beerResult = this.beerList;
  }

  pagination(pgNum) {
    this.pageNumber = pgNum;
    console.log(this.selectedFilter)
    if (this.selectedFilter) {
      this.api.callNextPage(pgNum, this.selectedFilter).subscribe((data) => {
        this.beerList = data;
      });
    } else {
      this.api.callNextPage(pgNum, null).subscribe((data) => {
        this.beerList = data;
      });
    }
  }

  nextPage() {
    let newPgNum = this.pageNumber + 1;
    this.pagination(newPgNum);
  }

  previousPage() {
    let newPgNum = this.pageNumber - 1;
    this.pagination(newPgNum);
  }

  ngOnInit() {
    this.api.callAPI().subscribe((data) => {
      this.beerList = data;
    });
    this.pageNumber = 1;
  }
}
