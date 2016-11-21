<?php

/*
 * This file is part of the FormsBundle.
 *
 * Copyright (c) 2016 BlueMesa LabDB Contributors <labdb@bluemesa.eu>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Bluemesa\Bundle\FormsBundle\Form\Type;

use JMS\DiExtraBundle\Annotation as DI;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\DateType;

/**
 * Bootstrap datepicker form control
 *
 * @author Radoslaw Kamil Ejsmont <radoslaw@ejsmont.net>
 * 
 * @DI\FormType
 */
class DatePickerType extends AbstractType
{
    /**
     * {@inheritDoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'widget_addon_append' => array(
                'icon'=> 'calendar'
            ),
            'attr' => array(
                'class' => 'date',
                'data-date-format' => 'dd MM yyyy'
            ),
            'widget' => 'single_text',
            'format' => 'dd MMMM yyyy',
        ));
    }

    /**
     * {@inheritDoc}
     */
    public function getParent()
    {
        return DateType::class;
    }
}
