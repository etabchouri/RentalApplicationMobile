function inventoryItemsSearchViewModel() {
    var self = this;

    self.term = ko.observable('');
    self.summary = ko.observable('');
    self.showSummary = ko.computed(function () { return this.summary && this.summary() && this.summary().length > 0; }, this);
    self.results = ko.observableArray([]);
    self.showResults = ko.computed(function () { return this.results && this.results() && this.results().length > 0; }, this);
    self.showMore = ko.observable(false);
    self.showTop = ko.observable(false);
    self.lastTerm = ko.observable('');
    self.index = ko.observable(0);
    self.size = ko.observable(25);
    self.count = ko.observable(0);
    self.keyUp = function (data, e) {
        if (e.keyCode == 13) {
            self.search();
        }
    };
    self.search = function () {
        self.showMore(false);
        self.showTop(false);
        self.results([]);

        if (self.term()) {

            self.summary('Searching for \"' + self.term() + '\"');

            var url = 'https://remote.corpservice.com:8143/RentalServices/Data/Entities/Service.svc/InventoryItems?CS-UserName=TIMLAJ&CS-Password=TIMLAJ&CS-Database=TQ_DEMO&$format=json&$filter=substringof(\'' + self.term() + '\', Code) or substringof(\'' + self.term() + '\', Description)&$top=0&$inlinecount=allpages';

            $.ajax({
                url: url,
                jsonp: '$callback',
                dataType: 'jsonp'
            })
            .fail(
            function (jqXHR, textStatus) {
                self.summary(textStatus);

            })
            .done(
            function (data, textStatus, jqXHR) {
                self.count(data.d.__count);
                self.summary(data.d.__count + ' items match \"' + self.term() + '\"');
                self.lastTerm(self.term());
                self.index(0);
                self.append();
            });
        }
        else
            self.summary('Enter a search term.');
    };
    self.append = function () {
        if (self.lastTerm()) {

            var url = 'https://remote.corpservice.com:8143/RentalServices/Data/Entities/Service.svc/InventoryItems?CS-UserName=TIMLAJ&CS-Password=TIMLAJ&CS-Database=TQ_DEMO&$format=json&$skip=' + self.index() * self.size() + '&$top=' + self.size() + '&$filter=substringof(\'' + self.lastTerm() + '\', Code) or substringof(\'' + self.lastTerm() + '\', Description)&$select=Code,Description,TotalInventory,TotalOnHand';

            $.ajax({
                url: url,
                jsonp: '$callback',
                dataType: 'jsonp'
            })
            .fail(
            function (jqXHR, textStatus) {
                self.summary(textStatus);
            })
            .done(
            function (data, textStatus, jqXHR) {

                for (var i in data.d) {
                    var item = data.d[i];
                    self.results.push({ Code: item.Code, Description: item.Description, Available: item.TotalOnHand + " of " + item.TotalInventory + " available" });
                }

                if (data.d.length == self.size()) {
                    self.showMore(true);
                }
                else {
                    self.showMore(false);
                }

                self.showTop(self.results().length >= self.size());
            })
            .always(
            function () {
                self.index(self.index() + 1);
                $('#inventory-items-search [data-bind="foreach: results"]').listview('refresh');
            });
        }
    };
}