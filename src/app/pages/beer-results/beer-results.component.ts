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

@Component({
  selector: "app-beer-results",
  templateUrl: "./beer-results.component.html",
  styleUrls: ["./beer-results.component.css"],
})
export class BeerResultsComponent implements OnInit {
  beerList: any;
  pageNumber: any;
  panelOpenState = false;
  prevDisable: boolean = true;
  nextDisable: boolean = false;
  selectedFilter: any = {
    alcoholContent: "",
    name: "",
    bitterness: 300,
  };

  constructor(
    private api: APICallService,
    public dialog: MatDialog // private router: Router
  ) {}

  public applyFilter(event, selection) {
    console.log(event);

    console.log(selection);

    if (event == "slider") {
      this.selectedFilter.name = "";
      this.selectedFilter.alcoholContent = "";
      this.api.filterBitterness(selection.bitterness).subscribe((data) => {
        // Response from API Call
        console.log("API Lesser Call", data), (this.beerList = data);
        this.disableNext(data);
      });
    } else if (event == "select") {
      this.selectedFilter.name = "";
      this.selectedFilter.bitterness = 300;
      if (selection.alcoholContent == "Greater") {
        this.api.filterAlcGreater().subscribe((data) => {
          // Response from API Call
          console.log("API Greater Call", data), (this.beerList = data);
          this.disableNext(data);
        });
      } else if (selection.alcoholContent == "Lesser") {
        this.api.filterAlcLess().subscribe((data) => {
          // Response from API Call
          console.log("API Lesser Call", data), (this.beerList = data);
          this.disableNext(data);
        });
      }
      this.pageNumber = 1;
    } else if (event == "search") {
      this.selectedFilter.alcoholContent = "";
      this.selectedFilter.bitterness = 300;
      this.selectedFilter.alcoholContent = "";
      this.api.searchByName(this.selectedFilter.name).subscribe((data) => {
        // Response from API Call
        console.log("API Search Call", data), (this.beerList = data);
        this.disableNext(data);
      });
      this.pageNumber = 1;
    } else {
      this.api.callAPI().subscribe((data) => {
        // Response from API Call
        console.log("API Call", data), (this.beerList = data);
        this.disableNext(data);
      });
      this.pageNumber = 1;
    }
  }

  disableNext(data) {
    let instance = Object.keys(data);
    var length = instance.length;
    if (length < 12) {
      this.nextDisable = true;
    } else {
      this.nextDisable = false;
    }
  }

  clearedSearch() {
    this.selectedFilter.name = "";
    this.api.callAPI().subscribe((data) => {
      // Response from API Call
      // console.log('API Call', data),
      this.beerList = data;
      this.disableNext(data);
    });
  }

  openDialog(beer) {
    const dialogConfig = new MatDialogConfig();
    const beerDialog = this.dialog.open(BeerDialogComponent, {
      width: "40%",
      height: "90%",
    });
    beerDialog.componentInstance.brew = beer;
  }

  pagination(pgNum) {
    this.pageNumber = pgNum;
    console.log(this.selectedFilter);
    if (this.selectedFilter) {
      this.api.callNextPage(pgNum, this.selectedFilter, this.selectedFilter.bitterness).subscribe((data) => {
        this.beerList = data;
        this.disableNext(data);
      });
    } else {
      this.api.callNextPage(pgNum, null, null).subscribe((data) => {
        this.beerList = data;
        this.disableNext(data);
      });
    }
    if (this.pageNumber !== 1) {
      this.prevDisable = false;
    } else {
      this.prevDisable = true;
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
    this.pageNumber = 1;
    this.api.callAPI().subscribe((data) => {
      this.beerList = data;
      console.log(data);
    });
  }
}
