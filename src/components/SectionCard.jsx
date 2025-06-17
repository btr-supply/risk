import React, { memo, useMemo } from 'react';
import { CardContent, Box } from '@mui/material';
import BaseCard from './BaseCard';
import { CardTitle } from './Typography';
import { MathFormula } from './MathFormula';
import { FormulaLegend } from './FormulaLegend';
import { getTitleIcon } from '@utils/componentUtils';
import {
  COMMON_SX,
  SPACING,
  createFlexColumnSx,
  createCardVariantSx,
} from '@constants';

// Unified Card component - replaces DescriptionCard, ParameterCard, and SimulationCard
// This eliminates 90+ lines of duplicated code across the three separate components
export const SectionCard = memo(
  ({
    // Common props
    title,
    children,
    action,
    sx = {},

    // Content type props
    variant = 'default', // 'description', 'parameter', 'simulation'
    formula, // For description cards
    controls, // For simulation cards

    // Layout props
    centerContent = false, // Whether to center the main content
    contentSx = {},

    ...props
  }) => {
    const titleIcon = useMemo(() => getTitleIcon(title), [title]);

    // Separate formula legend from other children for description variant
    const { mainContent, legendElement } = useMemo(() => {
      if (variant !== 'description') {
        return { mainContent: children, legendElement: null };
      }

      const allChildrenArray = React.Children.toArray(children);
      const mainContent = [];
      let legendElement = null;

      allChildrenArray.forEach((child) => {
        if (
          React.isValidElement(child) &&
          (child.type === FormulaLegend ||
            child.type?.displayName === 'FormulaLegend')
        ) {
          legendElement = child;
        } else {
          mainContent.push(child);
        }
      });

      return { mainContent, legendElement };
    }, [children, variant]);

    // Create dynamic content layout based on variant
    const contentLayout = useMemo(() => {
      const baseContentSx = {
        ...COMMON_SX.cardContent,
        ...contentSx,
      };

      // Simulation cards need centered content area
      if (variant === 'simulation') {
        return {
          ...baseContentSx,
          display: 'flex',
          flexDirection: 'column',
        };
      }

      return baseContentSx;
    }, [variant, contentSx]);

    // Main content wrapper styling
    const mainContentWrapperSx = useMemo(() => {
      if (variant === 'simulation') {
        return centerContent
          ? COMMON_SX.chartCenter
          : { width: '100%', flexGrow: 1 };
      }
      return createFlexColumnSx();
    }, [variant, centerContent]);

    return (
      <BaseCard
        sx={createCardVariantSx(variant, sx)}
        withContent={false}
        {...props}
      >
        <CardContent sx={contentLayout}>
          {/* Header with title and action */}
          {(title || action) && (
            <Box sx={COMMON_SX.cardHeader}>
              {title && <CardTitle icon={titleIcon}>{title}</CardTitle>}
              {action && <Box>{action}</Box>}
            </Box>
          )}

          {/* Controls section for simulation cards */}
          {controls && variant === 'simulation' && (
            <Box sx={{ mb: SPACING.card.headerMargin }}>{controls}</Box>
          )}

          {/* Main content area */}
          <Box sx={mainContentWrapperSx}>
            {mainContent}
            {formula && <MathFormula>{formula}</MathFormula>}
            {legendElement}
          </Box>
        </CardContent>
      </BaseCard>
    );
  }
);

SectionCard.displayName = 'SectionCard';

// Convenience exports with pre-configured variants
export const DescriptionCard = (props) => (
  <SectionCard variant="description" {...props} />
);

export const ParameterCard = (props) => (
  <SectionCard variant="parameter" {...props} />
);

export const SimulationCard = (props) => (
  <SectionCard variant="simulation" {...props} />
);
