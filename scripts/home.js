function inventoryCategoriesSearchViewModel() {
    var self = this;
}

function homeViewModel() {
    var self = this;

    self.inventoryItemsSearch = new inventoryItemsSearchViewModel();

    self.inventoryItemsLocate = new inventoryItemsLocateViewModel();

    self.inventoryCategoriesSearch = new inventoryCategoriesSearchViewModel();

    self.showHeaderButtons = ko.computed(function () {
        return navigator.userAgent.indexOf('iPhone') != -1;
    });
}

$(function () { ko.applyBindings(new homeViewModel()); });