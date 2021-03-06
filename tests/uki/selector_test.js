require('../test_helper.js');
include('uki-core/builder.js');
include('uki-core/selector.js');
include('uki-core/view/container.js');
include('uki-view/view/label.js');

uki.supportNativeLayout = true;

var Selector  = uki.Selector,
    Container = uki.view.Container,
    Label     = uki.view.Label;
    
Container.prototype._createDom = Label.prototype._createDom = function() {
    this._dom = document.createElement('div');
};

var tree = uki.build([{
    view: new Container(),
    rect: '0 0 1000 1000',
    name: 'top',
    childViews: [{
        view: new Container(),
        rect: '0 0 1000 1000',
        name: 'second',
        childViews: [
            {
                view: new Container(),
                rect: '10 10 100 100',
                name: 'third',
            
                childViews: [
                    {
                        view: new Label(),
                        rect: '10 10 100 100',
                        name: 'label1'
                    }
                ]
            },
            {
                view: new Label(),
                rect: '200 10 100 100',
                name: 'label2'
            }
        ]
    }]
}]);

QUnit.test("should tokenize expression", function() {
    var tokens = Selector.tokenize('label > * > project.views.CustomView Label[name^="wow"]')[0];
    QUnit.same(tokens, ['label', '>', '*', '>', 'project.views.CustomView', 'Label[name^="wow"]']);
});

QUnit.test("should filter * name", function() {
    var elements = Selector.find('*', tree);
    QUnit.equals(elements.length, 4);
    QUnit.equals(uki.attr(elements[0], 'name'), 'second');
    QUnit.equals(uki.attr(elements[1], 'name'), 'third');
    QUnit.equals(uki.attr(elements[2], 'name'), 'label1');
    QUnit.equals(uki.attr(elements[3], 'name'), 'label2');
});

QUnit.test("should filter * * name", function() {
    var elements = Selector.find('* *', tree);
    QUnit.equals(elements.length, 3);
    QUnit.equals(uki.attr(elements[0], 'name'), 'third');
    QUnit.equals(uki.attr(elements[1], 'name'), 'label1');
    QUnit.equals(uki.attr(elements[2], 'name'), 'label2');
});


QUnit.test("should filter by full typeName", function() {
    var elements = Selector.find('uki.view.Label', tree);
    QUnit.equals(elements.length, 2);
    QUnit.equals(uki.attr(elements[0], 'name'), 'label1');
    QUnit.equals(uki.attr(elements[1], 'name'), 'label2');
});

QUnit.test("should filter by contracted typeName", function() {
    var elements = Selector.find('Container', tree);
    QUnit.equals(elements.length, 2);
    QUnit.equals(uki.attr(elements[0], 'name'), 'second');
    QUnit.equals(uki.attr(elements[1], 'name'), 'third');
});

QUnit.test("should filter by attribute", function() {
    var elements = Selector.find('[name=second]', tree);
    QUnit.equals(elements.length, 1);
    QUnit.equals(uki.attr(elements[0], 'name'), 'second');
});

QUnit.test("should filter by attribute", function() {
    var elements = Selector.find('Container[name=second]', tree);
    QUnit.equals(elements.length, 1);
    QUnit.equals(uki.attr(elements[0], 'name'), 'second');
});


QUnit.test("should filter by '' attribute", function() {
    var elements = Selector.find('[name="second"]', tree);
    QUnit.equals(elements.length, 1);
    QUnit.equals(uki.attr(elements[0], 'name'), 'second');
});

QUnit.test("should filter by ^= attribute", function() {
    var elements = Selector.find('[name^="label"]', tree);
    QUnit.equals(elements.length, 2);
    QUnit.equals(uki.attr(elements[0], 'name'), 'label1');
    QUnit.equals(uki.attr(elements[1], 'name'), 'label2');
});

QUnit.test("should filter by $= attribute", function() {
    var elements = Selector.find('*[name$="bel1"]', tree);
    QUnit.equals(elements.length, 1);
    QUnit.equals(uki.attr(elements[0], 'name'), 'label1');
});

QUnit.test("should filter by ~= attribute", function() {
    var elements = Selector.find('[name ~= "abe"]', tree);
    QUnit.equals(elements.length, 2);
    QUnit.equals(uki.attr(elements[0], 'name'), 'label1');
    QUnit.equals(uki.attr(elements[1], 'name'), 'label2');
});

QUnit.test("should filter by > ", function() {
    var elements = Selector.find('>', [tree[0].childViews()[0]]);
    QUnit.equals(elements.length, 2);
    QUnit.equals(uki.attr(elements[0], 'name'), 'third');
    QUnit.equals(uki.attr(elements[1], 'name'), 'label2');
});

QUnit.test("should filter by > *", function() {
    var elements = Selector.find('> *', [tree[0].childViews()[0]]);
    QUnit.equals(elements.length, 2);
    QUnit.equals(uki.attr(elements[0], 'name'), 'third');
    QUnit.equals(uki.attr(elements[1], 'name'), 'label2');
});

QUnit.test("should filter by compound filter", function() {
    var elements = Selector.find('Container > Label', tree);
    QUnit.equals(elements.length, 2);
    QUnit.equals(uki.attr(elements[0], 'name'), 'label2');
    QUnit.equals(uki.attr(elements[1], 'name'), 'label1');
});

QUnit.test("should filter by pos eq", function() {
    var elements = Selector.find('Container:eq(1)', tree);
    QUnit.equals(elements.length, 1);
    QUnit.equals(uki.attr(elements[0], 'name'), 'third');
});

QUnit.test("should filter parent by pos eq", function() {
    var elements = Selector.find('Container:eq(0) > Label:eq(0)', tree);
    QUnit.equals(elements.length, 1);
    QUnit.equals(uki.attr(elements[0], 'name'), 'label2');
});

QUnit.test("should filter by pos gt", function() {
    var elements = Selector.find('Container:gt(0)', tree);
    QUnit.equals(elements.length, 1);
    QUnit.equals(uki.attr(elements[0], 'name'), 'third');
});

QUnit.test("should copy find to uki", function() {
    QUnit.ok(uki.find);
});
