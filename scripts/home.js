function inventoryItemsLocateViewModel() {
    var self = this;
}

function inventoryCategoriesSearchViewModel() {
    var self = this;
}

function homeViewModel() {
    var self = this;

    self.inventoryItemsSearch = new inventoryItemsSearchViewModel();

    self.inventoryItemsLocate = new inventoryItemsLocateViewModel();

    self.inventoryCategoriesSearch = new inventoryCategoriesSearchViewModel();
}

$(function () { ko.applyBindings(new homeViewModel()); });