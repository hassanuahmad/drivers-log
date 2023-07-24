"use client";
import { useState, useContext, Fragment } from "react";
import KebabMenu from "../../components/kebabMenu";
import DeleteModal from "../../components/deleteModal";
import Edit from "./edit";
import { calculateTotals } from "./utils";
import { InstructorIdContext, InstructorIdContextType } from "../layout";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { VehicleMaintenanceRecordsContext } from "../../context/recordsContext";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

type Record = {
    id: number;
    date: string;
    odometer: number;
    fueling: number;
    gas: number;
    maintenance: number;
    remarks: string;
};

export default function View() {
    const [deleteRecord, setDeleteRecord] = useState<{
        id: number;
        endpoint: string;
    } | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editRecordId, setEditRecordId] = useState<number | null>(null);
    const { instructorId }: InstructorIdContextType =
        useContext(InstructorIdContext);

    const {
        // @ts-ignore
        records,
        // @ts-ignore
        setRecords,
        // @ts-ignore
        selectedMonth,
        // @ts-ignore
        setSelectedMonth,
        // @ts-ignore
        selectedYear,
        // @ts-ignore
        setSelectedYear,
        // @ts-ignore
        totalGas,
        // @ts-ignore
        setTotalGas,
        // @ts-ignore
        totalMaintenance,
        // @ts-ignore
        setTotalMaintenance,
    } = useContext(VehicleMaintenanceRecordsContext);

    const monthOptions = [
        { label: "Jan", value: "01" },
        { label: "Feb", value: "02" },
        { label: "Mar", value: "03" },
        { label: "Apr", value: "04" },
        { label: "May", value: "05" },
        { label: "Jun", value: "06" },
        { label: "Jul", value: "07" },
        { label: "Aug", value: "08" },
        { label: "Sep", value: "09" },
        { label: "Oct", value: "10" },
        { label: "Nov", value: "11" },
        { label: "Dec", value: "12" },
    ];

    const years = [
        2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
    ];

    const handleDelete = (id: number, endpoint: string) => {
        setDeleteRecord({ id, endpoint });
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = () => {
        if (deleteRecord) {
            const newRecords = records.filter(
                // @ts-ignore
                (record) => record.id !== deleteRecord.id
            );
            setRecords(newRecords);
            const totals = calculateTotals(newRecords);
            setTotalGas(totals.totalGas);
            setTotalMaintenance(totals.totalMaintenance);
            setDeleteModalOpen(false);
        }
    };

    const handleEdit = (id: number) => {
        setEditRecordId(id);
    };

    const handleEditSave = (id: number, updatedRecord: Record) => {
        // @ts-ignore
        const updatedRecords = records.map((record) =>
            record.id === id ? { ...record, ...updatedRecord } : record
        );
        setRecords(updatedRecords);
        const totals = calculateTotals(updatedRecords);
        setTotalGas(totals.totalGas);
        setTotalMaintenance(totals.totalMaintenance);
        setEditRecordId(null);
    };

    const handleEditCancel = () => {
        setEditRecordId(null);
    };

    return (
        <>
            {/* Dropdowns Start */}
            <div className="flex">
                <div className="mr-4">
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                {
                                    monthOptions.find(
                                        (monthOption) =>
                                            monthOption.value === selectedMonth
                                    )?.label
                                }
                                <ChevronDownIcon
                                    className="-mr-1 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {monthOptions.map((monthOption, index) => (
                                        <Menu.Item key={index}>
                                            {({ active }) => (
                                                <a
                                                    className={classNames(
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700",
                                                        "block px-4 py-2 text-sm"
                                                    )}
                                                    onClick={() =>
                                                        setSelectedMonth(
                                                            monthOption.value
                                                        )
                                                    }
                                                >
                                                    {monthOption.label}
                                                </a>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            {selectedYear}
                            <ChevronDownIcon
                                className="-mr-1 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                {years.map((yearOption, index) => (
                                    <Menu.Item key={index}>
                                        {({ active }) => (
                                            <a
                                                className={classNames(
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                                onClick={() =>
                                                    setSelectedYear(yearOption)
                                                }
                                            >
                                                {yearOption}
                                            </a>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            {/* Dropdowns End */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle ">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                        >
                                            #
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Odometer
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Fueling
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Gas
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Maintenance
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Remarks
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                                        ></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {/* @ts-ignore */}
                                    {records.map((record, index) => (
                                        <tr
                                            key={index}
                                            className="even:bg-gray-50"
                                        >
                                            {editRecordId === record.id ? (
                                                <Edit
                                                    record={record}
                                                    index={index}
                                                    onEditSave={handleEditSave}
                                                    onCancel={handleEditCancel}
                                                />
                                            ) : (
                                                <>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                                        {index + 1}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.date}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.odometer}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.fueling}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        ${record.gas}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        ${record.maintenance}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.remarks}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                                        <KebabMenu
                                                            onDelete={() =>
                                                                handleDelete(
                                                                    record.id,
                                                                    `/api/${instructorId}/vehicle-maintenance`
                                                                )
                                                            }
                                                            onEdit={() =>
                                                                handleEdit(
                                                                    record.id
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr></tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Lesson Stats */}
            <div className="flex justify-end">
                <div className="flex flex-col">
                    <span className="text-right text-sm font-bold text-gray-500 pr-3 pt-6 ">
                        Gas:
                    </span>
                    <span className="text-right text-sm font-bold text-gray-500 pr-3 pt-4 pb-6 ">
                        Maintenance:
                    </span>
                </div>
                <div className="flex flex-col ml-3">
                    <span className="text-sm text-gray-500 pr-3 pt-6 text-right">
                        ${totalGas}
                    </span>
                    <span className="text-sm text-gray-500 pr-3 pt-4 pb-6 text-right">
                        ${totalMaintenance}
                    </span>
                </div>
            </div>
            {/* Delete Modal */}
            {deleteRecord && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onCancel={() => setDeleteModalOpen(false)}
                    onDeleteConfirm={handleDeleteConfirmed}
                    id={deleteRecord.id}
                    endpoint={deleteRecord.endpoint}
                />
            )}
        </>
    );
}
