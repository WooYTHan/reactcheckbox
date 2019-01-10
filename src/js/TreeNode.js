import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import NativeCheckbox from './NativeCheckbox';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';

class TreeNode extends React.Component {
    static propTypes = {
        checked: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        expanded: PropTypes.bool.isRequired,
        icons: iconsShape.isRequired,
        isLeaf: PropTypes.bool.isRequired,
        isParent: PropTypes.bool.isRequired,
        label: PropTypes.node.isRequired,
        lang: languageShape.isRequired,
        optimisticToggle: PropTypes.bool.isRequired,
        showNodeIcon: PropTypes.bool.isRequired,
        treeId: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        onCheck: PropTypes.func.isRequired,
        onExpand: PropTypes.func.isRequired,
        barSize: PropTypes.arrayOf(PropTypes.bool),
        children: PropTypes.node,
        className: PropTypes.string,
        color: PropTypes.string,
        expandOnClick: PropTypes.bool,
        icon: PropTypes.node,
        showCheckbox: PropTypes.bool,
        title: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        className: null,
        expandOnClick: false,
        barSize: null,
        color: null,
        icon: null,
        showCheckbox: true,
        title: null,
        onClick: () => {},
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    onCheck() {
        let isChecked = false;

        // Toggle off state to checked
        if (this.props.checked === 0) {
            isChecked = true;
        }

        // Toggle partial state based on cascade model
        if (this.props.checked === 2) {
            isChecked = this.props.optimisticToggle;
        }

        this.props.onCheck({
            value: this.props.value,
            checked: isChecked,
        });
    }

    onClick() {
        const {
            checked,
            expandOnClick,
            isParent,
            optimisticToggle,
            value,
            onClick,
        } = this.props;
        let isChecked = false;

        if (checked === 1) {
            isChecked = true;
        }

        // Get partial state based on cascade model
        if (checked === 2) {
            isChecked = optimisticToggle;
        }

        // Auto expand if enabled
        if (isParent && expandOnClick) {
            this.onExpand();
        }

        onClick({ value, checked: isChecked });
    }

    onExpand() {
        const { expanded, value, onExpand } = this.props;

        onExpand({ value, expanded: !expanded });
    }

    renderCollapseButton() {
        const { expandDisabled, isLeaf, lang } = this.props;

        if (isLeaf) {
            return (
                <span className="rct-collapse">
                    <span className="rct-icon" />
                </span>
            );
        }

        return (
            <Button
                className="rct-collapse rct-collapse-btn"
                disabled={expandDisabled}
                title={lang.toggle}
                onClick={this.onExpand}
            >
                {this.renderCollapseIcon()}
            </Button>
        );
    }

    renderCollapseIcon() {
        const { expanded, icons: { expandClose, expandOpen } } = this.props;

        if (!expanded) {
            return expandClose;
        }

        return expandOpen;
    }

    renderCheckboxIcon() {
        const { checked, icons: { uncheck, check, halfCheck } } = this.props;

        if (checked === 0) {
            return uncheck;
        }

        if (checked === 1) {
            return check;
        }

        return halfCheck;
    }

    renderNodeIcon() {
        const {
            expanded,
            icon,
            icons: { leaf, parentClose, parentOpen },
            isLeaf,
        } = this.props;

        if (icon !== null) {
            return icon;
        }

        if (isLeaf) {
            return leaf;
        }

        if (!expanded) {
            return parentClose;
        }

        return parentOpen;
    }

    renderBareLabel(children) {
        const { onClick, title } = this.props;
        const clickable = onClick.toString() !== TreeNode.defaultProps.onClick.toString();

        return (
            <span className="rct-bare-label" title={title}>
                {clickable ? (
                    <span
                        className="rct-node-clickable"
                        onClick={this.onClick}
                        onKeyPress={this.onClick}
                        role="button"
                        tabIndex={0}
                    >
                        {children}
                    </span>
                ) : children}
            </span>
        );
    }

    renderBarChart() {
        const { barSize, color } = this.props;
        console.log(color);
        const rectStyle = {
            fill: 'rgb(65,85,181,0.1)',
        };
        const rectStyle2 = {
            fill: '#4155B5',
        };
        return (
            <span className="bars">
                <svg width={80} height={15}>
                    <rect width={80} height={15} style={rectStyle} />
                    <rect width={barSize * 120} height={15} style={rectStyle2} />
                </svg>
            </span>
        );
    }

    renderCheckboxLabel(children) {
        const {
            checked,
            disabled,
            label,
            title,
            treeId,
            value,
            onClick,
            isLeaf,
            color,
        } = this.props;
        const clickable = onClick.toString() !== TreeNode.defaultProps.onClick.toString();
        const inputId = `${treeId}-${String(value).split(' ').join('_')}`;
        const checkBoxStyle = {
            fill: color,
        };

        const render = [(
            <label key={0} htmlFor={inputId} title={title}>
                <NativeCheckbox
                    checked={checked === 1}
                    disabled={disabled}
                    id={inputId}
                    indeterminate={checked === 2}
                    onChange={this.onCheck}
                />
                <span className="rct-checkbox" style={checkBoxStyle}>
                    {this.renderCheckboxIcon()}
                </span>
                {!isLeaf ? null : this.renderBarChart()}
                {!clickable ? children : null}
            </label>
        )];

        if (clickable) {
            render.push((
                <span
                    key={1}
                    className="rct-node-clickable"
                    onClick={this.onClick}
                    onKeyPress={this.onClick}
                    role="link"
                    tabIndex={0}
                >
                    {children}
                </span>
            ));
        }

        return render;
    }

    renderLabel() {
        const {
            label,
            showCheckbox,
            showNodeIcon,
            isLeaf,
            barSize,
        } = this.props;
        const labelChildren = [
            showNodeIcon ? (
                <span key={0} className="rct-node-icon">
                    {this.renderNodeIcon()}
                </span>
            ) : null,
            <span key={1} className="rct-title">
                {label}
                {!isLeaf ? ` (${barSize})` : null}
            </span>,
        ];

        if (!showCheckbox) {
            return this.renderBareLabel(labelChildren);
        }

        return this.renderCheckboxLabel(labelChildren);
    }

    renderChildren() {
        if (!this.props.expanded) {
            return null;
        }

        return this.props.children;
    }

    render() {
        const {
            className,
            disabled,
            expanded,
            isLeaf,
        } = this.props;
        const nodeClass = classNames({
            'rct-node': true,
            'rct-node-leaf': isLeaf,
            'rct-node-parent': !isLeaf,
            'rct-node-expanded': !isLeaf && expanded,
            'rct-node-collapsed': !isLeaf && !expanded,
            'rct-disabled': disabled,
        }, className);

        return (
            <li className={nodeClass}>
                <span className="rct-text">
                    {this.renderLabel()}
                    {this.renderCollapseButton()}
                </span>
                {this.renderChildren()}
            </li>
        );
    }
}

export default TreeNode;