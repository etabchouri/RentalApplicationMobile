function inventoryItemsSearchViewModel() {
    var self = this;

    self.term = ko.observable('');
    self.summary = ko.observable('');
    self.results = ko.observableArray([]);
    self.showMore = ko.observable(false);
    self.showTop = ko.observable(false);
    self.lastTerm = ko.observable('');
    self.index = ko.observable(0);
    self.size = ko.observable(25);
    self.keyUp = function (data, e) {
        if (e.keyCode == 13) {
            self.search();
        }
    };
    self.search = function () {
        self.showMore(false);
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
                self.summary(data.d.__count + ' items match \"' + self.term() + '\"');
                self.index(0);
                self.lastTerm(self.term());
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
                    self.results.push(data.d[i]);
                }

                if (data.d.length == self.size()) {
                    self.showMore(true);
                }
                else {
                    self.showMore(false);
                }
            })
            .always(
            function () {
                self.index(self.index() + 1);
            });
        }
    };
}