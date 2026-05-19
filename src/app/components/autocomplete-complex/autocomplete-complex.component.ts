import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SearchResult {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  score: number;
}

@Component({
  selector: 'app-autocomplete-complex',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autocomplete-complex.component.html',
  styleUrls: ['./autocomplete-complex.component.css']
})
export class AutoCompleteComplexComponent implements OnInit {
  query: string = '';
  results: SearchResult[] = [];
  groupedResults: { [key: string]: SearchResult[] } = {};
  isLoading: boolean = false;
  
  allData: SearchResult[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.generateHeavyData();
  }

  generateHeavyData() {
    const categories = ['Users', 'Projects', 'Documents', 'Tasks', 'Settings', 'Archive'];
    for (let i = 0; i < 1000; i++) {
      this.allData.push({
        id: i,
        category: categories[i % categories.length],
        title: `Search Item #${i} - ${Math.random().toString(36).substring(7)}`,
        description: `This is a heavy description for item ${i} to test performance. `.repeat(5),
        image: `https://ui-avatars.com/api/?name=Item+${i}&background=random`,
        score: Math.random() * 100
      });
    }
  }

  onInput() {
    if (this.query.length < 2) {
      this.results = [];
      this.groupedResults = {};
      return;
    }

    this.isLoading = true;
    // Simulate complex filtering logic
    setTimeout(() => {
      this.results = this.allData.filter(item => 
        item.title.toLowerCase().includes(this.query.toLowerCase()) ||
        item.description.toLowerCase().includes(this.query.toLowerCase())
      ).slice(0, 50);

      this.groupResults();
      this.isLoading = false;
      // Ensure change detection after async timeout-based mutation
      this.cdr.markForCheck();
    }, 300);
  }

  groupResults() {
    this.groupedResults = {};
    this.results.forEach(item => {
      if (!this.groupedResults[item.category]) {
        this.groupedResults[item.category] = [];
      }
      this.groupedResults[item.category].push(item);
    });
  }

  highlightMatch(text: string): string {
    if (!this.query) return text;
    const re = new RegExp(this.query, 'gi');
    return text.replace(re, match => `<mark>${match}</mark>`);
  }

  getGroupKeys() {
    return Object.keys(this.groupedResults);
  }
}
